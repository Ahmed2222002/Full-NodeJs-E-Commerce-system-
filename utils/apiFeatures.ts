import mongoose from "mongoose";
import { IProductFilters } from "../interfaces/productInterface";


const mongoOperatorsMap: Record<string, string> = {
    gte: '$gte',
    lte: '$lte',
    gt: '$gt',
    lt: '$lt',
    ne: '$ne',
    in: '$in',
    nin: '$nin',
};

const convertToMongoFilter = (filter: Record<string, any>) => {
    const mongoFilter: Record<string, any> = {};

    for (const field in filter) {
        const condition = filter[field];

        if (typeof condition === 'object' && condition !== null) {
            mongoFilter[field] = {};
            for (const op in condition) {
                const mongoOp = mongoOperatorsMap[op] || op;
                let value = condition[op];

                // convert to number if it's numeric
                if (!isNaN(value)) {
                    value = +value;
                }

                mongoFilter[field][mongoOp] = value;
            }
        } else {
            mongoFilter[field] = condition;
        }
    }

    return mongoFilter;
};


function generateQueryWithOptions(model: mongoose.Model<any, any>, requestQueryParams: any) {

    const { category, subCategory, brand, sold, price, ratingsAverage }: IProductFilters = requestQueryParams;
    console.log({ category, subCategory, brand, sold, price, ratingsAverage });

    const { page = 1, limit = 50, sortBy, fields, keyword } = requestQueryParams;

    const skip = (page - 1) * limit;

    // Base query with filters and search
    const query: any = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (brand) query.brand = brand;
    if (sold) query.sold = sold;
    if (price) query.price = price;
    if (ratingsAverage) query.ratingsAverage = ratingsAverage;

    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { name: { $regex: keyword, $options: 'i' } }
        ];
    }
    // Build mongoose query
    let mongooseQuery = model.find(query)
        .skip(skip)
        .limit(limit);

    // Sorting
    if (sortBy) {
        mongooseQuery = mongooseQuery.sort(sortBy.split(',').join(' '));
    } else {
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // Field limiting
    if (fields) {
        mongooseQuery = mongooseQuery.select(fields.split(',').join(' '));
    } else {
        mongooseQuery = mongooseQuery.select('-__v');
    }

    return mongooseQuery;
}

function getMongooseQueryFromRequest(model: mongoose.Model<any, any>, reqQuery: any) {

    const filters = convertToMongoFilter(reqQuery);

    return generateQueryWithOptions(model, filters);
}

export { getMongooseQueryFromRequest };