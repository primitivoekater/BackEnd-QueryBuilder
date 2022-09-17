const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        const produtos = await knex('produtos')
        .where({usuario_id:usuario.id})
        .where(query=>{if(categoria){
            return query.where('categoria','ilike',  `%${categoria}%`);
        
        }});

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produtos = await knex('produtos').where({id,usuario_id:usuario.id}).first();

        if (!produtos) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome||!estoque||!preco||!categoria||!descricao||!imagem) {
        return res.status(404).json('Todos os campos são obrigatorios!');
    }
   

    try {
        const produtos = await knex('produtos')
        .insert({usuario_id:usuario.id,nome, estoque, preco, categoria, descricao, imagem})
        .returning('*')

        if (!produtos) {
            return res.status(400).json('Erro ao  cadastrar o produto');
        }

        return res.status(200).json({mensagem:'O produto foi cadastrado com sucesso.', produto:produtos[0]});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const produtoExiste = await knex('produtos').where({id, usuario_id:usuario.id}).first()

        if (!produtoExiste) {
            return res.status(404).json('Produto não encontrado');
        }

      const produtoAtualizado = await  knex ('produto')
      .where ({id})
      .update ({nome, estoque, preco, categoria, descricao, imagem})
      

        if (!produtoAtualizado) {
            return res.status(400).json("Erro ao atualizar o produto");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex('produtos').where({id,usuario_id:usuario.id}).first();


        if (!produtoEncontrado) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').where({id,usuario_id:usuario.id}).del();

        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}