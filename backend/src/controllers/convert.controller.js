import axios from 'axios';


const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};


export async function getInfo(req, res) {
    try {
        const { url } = req.body;

        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                message: "YouTube URL is required." 
            });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid YouTube URL format." 
            });
        }

        // RapidAPI Configuration (YouTube MP36 API)
        const options = {
            method: 'GET',
            url: 'https://youtube-mp36.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        
        if (response.data && response.data.status === 'ok') {
            return res.status(200).json({
                success: true,
                data: {
                    id: videoId,
                    url: response.data.link, // This is the direct .mp3 download link
                    title: response.data.title || "YouTube Audio",
                    duration: response.data.duration || 0,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                }
            });
        } else {
            return res.status(422).json({ 
                success: false, 
                message: response.data.msg || "API could not process this video." 
            });
        }

    } catch (err) {
        console.error("[ConvertController Error]:", err.message);
        
        
        const statusCode = err.response?.status || 500;
        const errorMessage = err.response?.data?.message || "Internal Server Error";

        return res.status(statusCode).json({ 
            success: false, 
            message: errorMessage 
        });
    }
}