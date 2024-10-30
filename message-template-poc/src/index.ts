import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { MessageAnalyzer } from './services/messageAnalyzer';
import categoryRoutes from './routes/categoryRoutes';
import templateRoutes from './routes/templateRoutes';


const app = express();
const PORT = process.env.PORT || 3000;
const messageAnalyzer = new MessageAnalyzer();

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/categories', categoryRoutes);
app.use('/api/templates', templateRoutes);

// Rota de teste
app.get('/api/test', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ message: 'API funcionando!' });
    } catch (error) {
        next(error);
    }
});

app.get('/manager', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/manager.html'));
});

// Rota para análise de mensagem
app.post('/api/analyze', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Mensagem não fornecida' });
        }
        const analysis = await messageAnalyzer.analyzeMessage(message);
        res.json({ original: message, analysis });
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