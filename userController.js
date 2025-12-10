// userController.js (ANTES - COMPLETAMENTE INSEGURO)
async function login(req, res) {
  const { email, password } = req.body;

  // ❌ SQL Injection – string concatenada
  const query = "SELECT * FROM users WHERE email = '" + email + "'";
  const user = await db.raw(query);

  if (!user) return res.status(404).send("User not found");

  // ❌ Senha armazenada em texto puro e comparação insegura
  if (password == user.password) {

    // ❌ Vazamento de dados sensíveis em logs
    console.log("LOGIN SUCCESS for user:", user);

    // ❌ Token fraco, sem expiração, sem chave segura
    const token = jwt.sign({ userId: user.id }, "1234");

    // ❌ Retorna todos os dados do usuário — inclusive campos sensíveis
    return res.status(200).json({
      message: "OK",
      token,
      user
    });
  }
  
  // ❌ Bypass absurdo: qualquer senha com 3 caracteres passa
  if (password.length <= 3) {
    return res.status(200).send("Auto-Login bypass enabled");
  }
  return res.status(401).send("Invalid credentials");
}