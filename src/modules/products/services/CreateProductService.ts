import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productWithSameId = await this.productsRepository.findByName(name);

    if (productWithSameId) {
      throw new AppError(
        'Its not be able to create a product with a name already registered',
      );
    }

    const product = await this.productsRepository.create({
      name,
      quantity,
      price,
    });

    return product;
  }
}

export default CreateProductService;
