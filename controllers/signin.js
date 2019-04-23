const handleSignIn = (db, bcrypt) => (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json('incorect form submission');
    }

    db('login')
        .where({
            email: email,
        })
        .select('hash')
        .then(hash => {
            bcrypt.compare(String(password), hash[0].hash, function (err, bres) {

                if (bres) {
                    db('users')
                        .where({
                            email: email,
                        })
                        .select('*')
                        .then(data => {
                            res.status(200).json(data[0])
                        })
                } else {
                    res.status(400).json('wrong credentials');
                }
            });
        })
        .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleSignIn: handleSignIn
}