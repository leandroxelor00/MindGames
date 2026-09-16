import { apiFetch } from './api';
import { salvarPendente } from './pendingScores';

export async function postScore(result) {
    try {
        return await apiFetch('/scores', {
            method: 'POST',
            body: JSON.stringify(result),
        });
    } catch (error) {
        salvarPendente(result);
        throw error;
    }
}

export async function getHistory(userId) {
    try {
        const resultado = await apiFetch(`/scores/${userId}`);
        return resultado.result;
    } catch (error) {
        if (error.message.includes('Erro na API: 404')) {
            return [];
        }
        throw error;
    }
}