import ApiError from "../../utils/ApiError.js";
import Station from "./station.model.js";
import {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern,
} from "../../utils/cache.js";

export const getStations = async ({ search, page, limit, adminView }) => {
  const cacheKey = `stations:${search || "all"}:${page}:${limit}:${adminView}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  if (!adminView) query.status = true;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Station.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Station.countDocuments(query),
  ]);

  const result = {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 3600);

  return result;
};

export const getStationById = async (id, adminView) => {
  const cacheKey = `station:${id}:${adminView}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const query = { _id: id };
  if (!adminView) query.status = true;

  const station = await Station.findOne(query).lean();

  if (!station) throw new ApiError(404, "Station not found");

  await setCache(cacheKey, station, 3600);

  return station;
};

export const createStation = async (body) => {
  const station = await Station.create(body);

  await deleteByPattern("stations:*");

  return station;
};

export const updateStation = async (id, body) => {
  const station = await Station.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!station) throw new ApiError(404, "Station not found");

  await deleteByPattern("stations:*");

  await deleteCache(`station:${id}:true`);
  await deleteCache(`station:${id}:false`);

  return station;
};

export const deleteStation = async (id) => {
  const station = await Station.findByIdAndUpdate(
    id,
    { status: false },
    { new: true },
  );

  if (!station) throw new ApiError(404, "Station not found");

  await deleteByPattern("stations:*");

  await deleteCache(`station:${id}:true`);
  await deleteCache(`station:${id}:false`);

  return station;
};
