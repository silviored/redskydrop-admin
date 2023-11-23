import cep from 'cep-promise';
import type { CEP } from 'cep-promise';

export const getAddressByCEP = async (
  zipCode: string
): Promise<Omit<CEP, 'service'> | undefined> => {
  console.log(zipCode, 'CDas')
  try {
    const response = await cep(zipCode);
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
    return;
  }
};

export const AddressService = {
  getAddressByCEP,
};
