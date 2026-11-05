"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "employee" | "analyst";
type User = { id: string; name: string; email: string; role: Role };

export function AuthArea({ requiredRole }: { requiredRole: Role }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("nexo_token");
    if (!token) {
      router.replace("/");
      return;
    }
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Sessão inválida");
        return response.json() as Promise<{ user: User }>;
      })
      .then(({ user: authenticatedUser }) => {
        if (authenticatedUser.role !== requiredRole) {
          router.replace(authenticatedUser.role === "analyst" ? "/analyst" : "/chat");
          return;
        }
        setUser(authenticatedUser);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        sessionStorage.removeItem("nexo_token");
        setError(reason instanceof Error ? reason.message : "Erro de conexão");
      });
    return () => controller.abort();
  }, [requiredRole, router]);

  function logout() {
    sessionStorage.removeItem("nexo_token");
    router.replace("/");
  }

  if (error) return <main style={{ padding: 40 }}><p>{error}. Faça login novamente.</p><button onClick={logout}>Voltar ao login</button></main>;
  if (!user) return <main style={{ padding: 40 }}>Verificando sessão...</main>;

  return (
    <main style={{ maxWidth: 850, margin: "70px auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <strong style={{ color: "#2569e8" }}>✳ Nexo Assist</strong>
        <button onClick={logout}>Sair</button>
      </header>
      <h1>{requiredRole === "analyst" ? "Console do analista" : "Central de atendimento"}</h1>
      <p>Olá, <strong>{user.name}</strong>!</p>
      <p>Perfil: {requiredRole === "analyst" ? "Analista de TI" : "Funcionário"} · {user.email}</p>
      <section style={{ marginTop: 35, border: "1px solid #dbe1ea", borderRadius: 12, padding: 24, background: "#f7f9fc" }}>
        <h2>{requiredRole === "analyst" ? "Fila de atendimentos" : "Assistente virtual"}</h2>
        <p>{requiredRole === "analyst" ? "A fila de conversas será implementada na próxima etapa." : "O chat e o histórico de chamados serão implementados na próxima etapa."}</p>
      </section>
    </main>
  );
}
