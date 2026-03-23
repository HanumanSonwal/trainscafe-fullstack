import Station from "./station.model.js";

export const getStations = async ({ search, page, limit, adminView }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  if (!adminView) {
    query.status = true;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Station.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Station.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStationById = async (id, adminView) => {
  const query = { _id: id };

  if (!adminView) {
    query.status = true;
  }

  const station = await Station.findOne(query).lean();

  if (!station) throw new Error("Station not found");

  return station;
};

export const createStation = async (body) => {
  return await Station.create(body);
};

export const updateStation = async (id, body) => {
  const station = await Station.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!station) throw new Error("Station not found");

  return station;
};

// 🔥 Soft delete
export const deleteStation = async (id) => {
  const station = await Station.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  if (!station) throw new Error("Station not found");

  return station;
};