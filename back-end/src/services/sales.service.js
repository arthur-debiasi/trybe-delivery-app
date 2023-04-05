const sequelize = require('sequelize');
const { Sale, SalesProduct, Product, User } = require('../database/models');
const userService = require('./users.service');
const { CustomError } = require('../errors/custom.error');
const formatSaleDetails = require('../utils/formatSaleDetails');

const getAll = async () => Sale.findAll();

const getById = async (saleId) => Sale.findByPk(saleId);

const getByUserId = async (userId) => Sale.findAll({ where: { userId } });

const createSale = async ({
  userId,
  sellerId,
  totalPrice,
  deliveryAddress,
  deliveryNumber,
}) => {
  const newSale = await Sale.create({
    userId,
    sellerId,
    totalPrice,
    deliveryAddress,
    deliveryNumber,
    saleDate: sequelize.fn('NOW'),
    status: 'Pendente',
  });
  return newSale;
};

const createSaleAndSaleProduct = async ({ products, ...saleData }) => {
  const user = await userService.getByUserId(saleData.userId);
  if (user.role !== 'customer') { throw CustomError('401', 'O ID informado não é de um cliente'); }

  const seller = await userService.getByUserId(saleData.sellerId);
  if (seller.role !== 'seller') { throw CustomError('401', 'O ID informado não é de um vendedor'); }

  const newSale = await createSale(saleData);

  const mapQuantity = products.map(({ productId, quantity }) => ({
    saleId: newSale.id,
    productId,
    quantity,
  }));

  await SalesProduct.bulkCreate(mapQuantity);
  return { message: 'Venda cadastrada com sucesso', id: newSale.id };
};

const getSaleDetails = async (saleId) => {
  const sale = await Sale.findOne({ where: { id: saleId } });
  const products = await Product.findAll({});
  const seller = (await User.findOne({ where: { id: sale.sellerId } })).name;
  const salesProducts = await SalesProduct.findAll({ where: { saleId } });
  return formatSaleDetails(sale, products, seller, salesProducts);
};

module.exports = {
  getById,
  createSaleAndSaleProduct,
  getAll,
  getByUserId,
  getSaleDetails,
};
