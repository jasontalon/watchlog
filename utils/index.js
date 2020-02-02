import axios from "axios";
export const gql = async ({ query, variables }) => {

  const {
    data //: { errors = null, data = null }
  } = await axios.post(
    GQL_URL(),
    {
      query,
      variables
    },
    {
      headers: {
        ...GQL_SECRET()
      }
    }
  );

  return data;
};

export const GQL_URL = () => {
  return process.env.GQL_URL || "";
};

export const GQL_SECRET = () => {
  const [headerKey, headerVal] = process.env.GQL_SECRET.split(":");
  return {
    [headerKey]: headerVal
  };
};
