
const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome||!email||!senha||!nome_loja) {
        return res.status(404).json("Todos os campso são obrigatorios");
    }

    try {
        const quantidadeUsuarios = await  knex('usuarios').where({email})
        
        if (quantidadeUsuarios>0) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex('usuarios')
        .insert({nome, email, senha:senhaCriptografada, nome_loja})
        .returning('*')


        if (!novoUsuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json({message:"O usuario foi cadastrado com sucesso!",
        novoUsuario});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const{id} =req.usuario
    let { nome, email, senha, nome_loja } = req.body;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }


        try {
            const usuarioExiste = await knex('usuarios').where({id}).first()
    
            if (!usuarioExiste) {
                return res.status(404).json('Usuario não encontrado');
            }

            if (senha){
                senha=await bcrypt.hash(senha,10)
            }

            if (email !== req.usuario.email) {
                const emailUsuarioExiste = await knex('usuarios').where({ email }).first();
    
                if (emailUsuarioExiste) {
                    return res.status(404).json('O Email já existe.');
                }
            }
    
          const usuarioAtualizado = await  knex ('usuarios')
          .update ({nome, email, senha,nome_loja})
          .where ({id});
    
            if (!usuarioAtualizado) {
                return res.status(400).json("O Usuario não foi atualizado");
            }
    
            return res.status(200).json('Usuario foi atualizado com sucesso.');
        } catch (error) {
            return res.status(400).json(error.message);
        }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}