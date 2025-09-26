'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DialogoConfirmacion({ open, onOpenChange, onConfirm, title, description, confirmText='Confirmar', cancelText='Cancelar', isDestructive=false, isLoading=false }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isDestructive && <AlertTriangle className="h-6 w-6 text-red-600"/>}
            <div>
              <DialogTitle>{title}</DialogTitle>
              <p className="mt-2">{description}</p>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{cancelText}</Button>
          <Button variant={isDestructive ? 'destructive' : 'default'} onClick={onConfirm} disabled={isLoading}>{isLoading ? 'Procesando...' : confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
