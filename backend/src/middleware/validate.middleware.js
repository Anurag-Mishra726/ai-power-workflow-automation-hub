export const validateRequest = (schema) => {
    return (req, res, next) => {
       try{
           console.log(req.body);
            schema.parse(req.body);
            next();
       } catch (error) {
        console.error("Validation Error --> :", error);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
       }
    }
}