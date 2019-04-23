const handleRegister = (req, res, db, bcrypt)=>{
    const {email, name, password} = req.body;
    
    if (!email || !name || !password){
        return res.status(400).json('incorect form submission');
    }
    
    // console.log("My register request is:", email, name, password);

    bcrypt.hash(password, null, null, function(err, hash) {
        db.transaction(trx =>{
            trx.insert({
                email: email,
                hash: hash,
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(data => {
                    res.status(200).json(data[0])
                })
            })
            .then(trx.commit)
            .then(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'));
    })
        
}

module.exports = {
    handleRegister:handleRegister
}