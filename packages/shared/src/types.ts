export type ConversationStatus =
  | "agent_active"
  | "waiting_analyst"
  | "analyst_active"
  | "closed";

export type TicketType = "INC" | "REQ";
export type TicketPriority = "critical" | "high" | "medium" | "low";
