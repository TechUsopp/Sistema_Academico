const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Importa o CORS
const app = express();
const port = 3000;

// Habilita o CORS para todas as rotas
app.use(cors());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_academico'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para obter todos os cursos
app.get('/cursos', (req, res) => {
    db.query('SELECT curso_id, curso_nome FROM cursos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para obter as turmas de um curso específico
app.get('/turmas/:curso_id', (req, res) => {
    const { curso_id } = req.params;
    const sql = `SELECT turmas.turma_id, turmas.turma_nome 
                 FROM turmas 
                 INNER JOIN grades ON grades.grade_id = turmas.grade_id 
                 WHERE grades.curso_id = ?`;

    db.query(sql, [curso_id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para obter os alunos de uma turma específica
app.get('/alunos/:turma_id', (req, res) => {
    const { turma_id } = req.params;
    const sql = `SELECT alunos.aluno_nome, alunos.aluno_email 
                 FROM alunos 
                 INNER JOIN matriculas ON matriculas.aluno_id = alunos.aluno_id 
                 WHERE matriculas.turma_id = ?`;

    db.query(sql, [turma_id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
