// ticketGenerator.ts
export function generateTicket(saleData: any): string {
    // L�gica para generar el ticket aqu�
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
