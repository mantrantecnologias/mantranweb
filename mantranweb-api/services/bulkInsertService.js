import sql from "mssql";

export default async function bulkInsert(pool, linhas) {

    const table = new sql.Table("ShopeeImportacao");

    table.create = false;

    table.columns.add("Pedido", sql.VarChar(50));
    table.columns.add("Cidade", sql.VarChar(50));
    table.columns.add("Valor", sql.Decimal(18, 2));

    for (const l of linhas) {
        table.rows.add(l.pedido, l.cidade, l.valor);
    }

    await pool.request().bulk(table);
}
