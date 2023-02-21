const db = require('../db/index.js');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    
    let user = await db.query(`SELECT * FROM users WHERE refresh_token=$1`, [refreshToken])
        .then(res => res.rows.length ? res.rows[0] : null);
    if (user) {
        await db.query(`UPDATE users SET refresh_token=null WHERE id=$1`, [user.id]);
    }
    

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
    res.sendStatus(204);
}

module.exports = { handleLogout }
