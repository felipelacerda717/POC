import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { MessageAnalyzer } from './services/messageAnalyzer';

const app = express();
const PORT = process.env.PORT || 3000;
const messageAnalyzer = new MessageAnalyzer();

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota de teste
app.get('/api/test', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ message: 'API funcionando!' });
    } catch (error) {
        next(error);
    }
});

// Rota para análise de mensagem
app.post('/api/analyze', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body;
   
        if (!message) {
            res.status(400).json({
                error: 'Mensagem não fornecida'
            });
            return;
        }

        const analysis = messageAnalyzer.analyzeMessage(message);
        res.json({
            original: message,
            analysis
        });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo deu errado!',
        message: err.message
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta: ${PORT}`);
});

export default app;