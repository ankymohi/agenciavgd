import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { BUNNY_STORAGE_NAME, BUNNY_STORAGE_PASSWORD, BUNNY_STORAGE_URL, BUNNY_BASE_URL } = process.env;

// Fetch images by folder name (basic, premium, vip)
export const getImagesByPlan = async (req, res) => {
  const { plan } = req.params;

  try {
    const url = `${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_NAME}/${plan}/`;
    const response = await axios.get(url, {
      headers: {
        AccessKey: BUNNY_STORAGE_PASSWORD,
      },
    });

    // Bunny returns a list of files
    const files = response.data.map((file) => ({
      name: file.ObjectName,
      url: `${BUNNY_BASE_URL}/${plan}/${file.ObjectName}`,
    }));

    res.json(files);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ message: "Error fetching images", error });
  }
};
