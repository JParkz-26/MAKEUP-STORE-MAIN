// ticketGenerator.ts
export function generateTicket(saleData: any): string {
    // Lógica para generar el ticket aquí
    const ticket = `
    -- Ticket de Venta --
    Productos: ${saleData.products}
    Subtotal: $${saleData.subtotal}
    IVA: $${saleData.iva}
    Total: $${saleData.total}
    ------------------------
  `;
    return ticket;
}
