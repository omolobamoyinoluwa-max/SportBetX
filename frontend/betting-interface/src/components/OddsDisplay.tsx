import React from 'react';
export const OddsDisplay: React.FC<{ odds: number; format?: string }> = ({ odds }) => <span>{odds}</span>;
