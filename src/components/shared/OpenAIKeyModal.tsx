import { useState } from 'react';
import { Key, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OpenAIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey?: string | null;
}

export function OpenAIKeyModal({ isOpen, onClose, onSave, currentKey }: OpenAIKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const handleValidate = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        setValidationResult('success');
      } else {
        setValidationResult('error');
      }
    } catch {
      setValidationResult('error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      setApiKey('');
      setValidationResult(null);
      onClose();
    }
  };

  const handleClose = () => {
    setApiKey('');
    setValidationResult(null);
    onClose();
  };

  const maskedKey = currentKey
    ? `${currentKey.slice(0, 7)}...${currentKey.slice(-4)}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-brand-teal" />
            Configurar OpenAI API Key
          </DialogTitle>
          <DialogDescription>
            Configure sua chave de API do OpenAI para habilitar os recursos de IA da plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {maskedKey && (
            <div className="p-3 bg-surface-light rounded-lg">
              <p className="text-sm text-text-muted mb-1">Chave atual:</p>
              <code className="text-sm font-mono">{maskedKey}</code>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey">Nova API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setValidationResult(null);
                  }}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                variant="outline"
                onClick={handleValidate}
                disabled={!apiKey.trim() || isValidating}
              >
                {isValidating ? 'Validando...' : 'Validar'}
              </Button>
            </div>
          </div>

          {validationResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                validationResult === 'success'
                  ? 'bg-status-success/10 text-status-success'
                  : 'bg-status-error/10 text-status-error'
              }`}
            >
              {validationResult === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">API Key válida!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">API Key inválida. Verifique e tente novamente.</span>
                </>
              )}
            </div>
          )}

          <div className="text-xs text-text-muted space-y-1">
            <p>
              Sua chave é armazenada localmente no navegador e nunca é enviada para nossos servidores.
            </p>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-brand-secondary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Criar uma API Key no OpenAI
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim() || validationResult === 'error'}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OpenAIKeyModal;
