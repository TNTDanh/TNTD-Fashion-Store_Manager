const pool = require('../config/db');

exports.index = async (req, res) => {
  try {
    const [[revenueRow]] = await pool.query(
      'SELECT COALESCE(SUM(final_amount),0) AS revenue FROM sales_invoices'
    );
    const [[purchaseRow]] = await pool.query(
      'SELECT COALESCE(SUM(total_amount),0) AS purchases FROM purchase_receipts'
    );
    const [lowStock] = await pool.query(
      `SELECT pv.id, pv.sku, pv.size, pv.color, pv.stock_quantity, pv.price, p.name AS product_name
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.id
       WHERE pv.stock_quantity < 5
       ORDER BY pv.stock_quantity ASC
       LIMIT 10`
    );
    const [topProducts] = await pool.query(
      `SELECT p.name AS product_name, pv.sku, SUM(sii.quantity) AS total_sold
       FROM sales_invoice_items sii
       JOIN product_variants pv ON sii.product_variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       GROUP BY p.name, pv.sku
       ORDER BY total_sold DESC
       LIMIT 5`
    );
    res.render('dashboard/index', {
      title: 'Tổng quan',
      revenue: revenueRow.revenue,
      purchases: purchaseRow.purchases,
      lowStock,
      topProducts
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.render('dashboard/index', {
      title: 'Tổng quan',
      revenue: 0,
      purchases: 0,
      lowStock: [],
      topProducts: [],
      error: 'Không tải được dữ liệu'
    });
  }
};
