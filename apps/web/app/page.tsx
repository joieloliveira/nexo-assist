"use client";

import { useState, type FormEvent } from "react";
import "./login.css";

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Interface pronta! O acesso com usuários de demonstração será conectado à API na próxima etapa.");
  }

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="Apresentação do Nexo Assist">
        <div className="brand-top"><span className="brand-icon">✳</span><span>Nexo <strong>Assist</strong></span></div>
        <div className="brand-content">
          <span className="eyebrow"><span className="status-dot" /> SEU SUPORTE INTELIGENTE</span>
          <h1>Suporte de TI<br />mais simples.<br /><span>Mais humano.</span></h1>
          <p>Resolva problemas, acompanhe chamados e fale com nossa equipe em um só lugar, com a ajuda da inteligência artificial.</p>
          <div className="preview-card">
            <div className="preview-heading"><span className="avatar">✳</span><div><strong>Nexo Assist</strong><small>Assistente virtual · Online</small></div><span className="preview-dots">•••</span></div>
            <div className="preview-message">Olá! 👋 Como posso ajudar você hoje?</div>
            <div className="preview-actions"><span>🔐 Problemas de acesso</span><span>💻 Abrir chamado</span></div>
          </div>
          <div className="brand-stats"><div><strong>24/7</strong><span>Assistência disponível</span></div><div><strong>IA + Pessoas</strong><span>Suporte completo</span></div></div>
        </div>
        <div className="brand-footer">© 2026 Nexo Assist. Tecnologia a serviço de pessoas.</div>
      </section>

      <section className="form-panel" aria-label="Acesso à plataforma">
        <div className="mobile-brand"><span className="brand-icon">✳</span> Nexo <strong>Assist</strong></div>
        <div className="login-form-wrap">
          <div className="welcome-icon" aria-hidden="true">↗</div>
          <h2>Bem-vindo de volta</h2>
          <p className="form-intro">Entre com suas credenciais corporativas para acessar a plataforma.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail corporativo</label>
            <input id="email" type="email" autoComplete="username" placeholder="seu.nome@empresa.com.br" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Senha</label>
            <div className="password-field"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</button></div>
            <label className="remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Manter conectado</label>
            <button className="submit-button" type="submit">Entrar na plataforma <span aria-hidden="true">→</span></button>
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </form>
          <div className="security-note"><span aria-hidden="true">♢</span><span>Ambiente corporativo seguro. Seus dados são tratados com confidencialidade.</span></div>
        </div>
        <footer className="form-footer">Precisa de ajuda para acessar? <span>Entre em contato com o Service Desk.</span></footer>
      </section>
    </main>
  );
}
