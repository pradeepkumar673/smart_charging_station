import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AlertTriangle, WifiOff, ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ErrorState({
  icon: Icon = AlertTriangle,
  title = 'Hardware Connection Issue',
  description = 'Unable to establish millisecond telemetry handshake with the charging dispenser.',
  primaryActionLabel = 'Retry Connection',
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  fullPage = false,
}) {
  const content = (
    <Card className="text-center mx-auto max-w-md p-6 sm:p-8 space-y-4 border-[#ffb4ab]/40 shadow-2xl">
      <div className="p-3.5 w-fit mx-auto rounded-2xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab]">
        <Icon className="w-10 h-10" />
      </div>

      <div className="space-y-1">
        <h3 className="font-headline font-bold text-xl text-white">{title}</h3>
        <p className="text-xs text-[#cbc4d2] leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
        {onPrimaryAction && (
          <Button variant="primary" size="md" icon={RefreshCw} onClick={onPrimaryAction} fullWidth>
            {primaryActionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button variant="secondary" size="md" onClick={onSecondaryAction} fullWidth>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </Card>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-[#141218] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}
