import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Map Stellar error codes to human-readable messages
const STELLAR_ERROR_MESSAGES: Record<string, string> = {
  tx_insufficient_balance: 'Insufficient balance to complete this transaction.',
  tx_bad_seq: 'Transaction sequence number mismatch. Please retry.',
  tx_bad_auth: 'Transaction authorization failed. Check your signing key.',
  tx_no_account: 'Account not found on the Stellar network.',
  tx_insufficient_fee: 'Transaction fee is too low. Please increase the fee.',
  tx_bad_auth_extra: 'Unnecessary signatures provided.',
  tx_internal_error: 'An internal Stellar network error occurred.',
  op_no_destination: 'Destination account does not exist.',
  op_underfunded: 'Insufficient funds for this operation.',
  op_low_reserve: 'Account would fall below minimum reserve after this operation.',
};

export interface StellarTransactionError extends Error {
  response?: {
    data?: {
      extras?: {
        result_codes?: {
          transaction?: string;
          operations?: string[];
        };
      };
    };
  };
  code?: string;
}

export function parseStellarError(error: StellarTransactionError): {
  message: string;
  code: string;
  retryable: boolean;
} {
  const resultCodes = error.response?.data?.extras?.result_codes;
  const txCode = resultCodes?.transaction || error.code || 'unknown';
  const opCodes = resultCodes?.operations || [];

  // Check operation-level errors first
  for (const opCode of opCodes) {
    if (STELLAR_ERROR_MESSAGES[opCode]) {
      return {
        message: STELLAR_ERROR_MESSAGES[opCode],
        code: opCode,
        retryable: opCode === 'tx_bad_seq',
      };
    }
  }

  // Check transaction-level error
  if (STELLAR_ERROR_MESSAGES[txCode]) {
    return {
      message: STELLAR_ERROR_MESSAGES[txCode],
      code: txCode,
      retryable: txCode === 'tx_bad_seq',
    };
  }

  // Handle ContractError codes from Soroban
  if (error.message?.includes('ContractError')) {
    return {
      message: 'Smart contract execution failed. Please check your inputs.',
      code: 'contract_error',
      retryable: false,
    };
  }

  return {
    message: 'Transaction failed. Please try again.',
    code: txCode,
    retryable: false,
  };
}

export function stellarErrorMiddleware(
  err: StellarTransactionError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isStellarError =
    err.response?.data?.extras?.result_codes !== undefined ||
    err.message?.includes('TransactionSubmit') ||
    err.message?.includes('ContractError') ||
    err.code?.startsWith('tx_') ||
    err.code?.startsWith('op_');

  if (!isStellarError) {
    return next(err);
  }

  const parsed = parseStellarError(err);

  // Log full error server-side for debugging
  logger.error('Stellar transaction error', {
    code: parsed.code,
    message: parsed.message,
    retryable: parsed.retryable,
    url: req.originalUrl,
    method: req.method,
    raw: err.response?.data || err.message,
  });

  res.status(422).json({
    error: 'StellarTransactionError',
    message: parsed.message,
    code: parsed.code,
    retryable: parsed.retryable,
  });
}
