import { useAuth } from "../stores/auth"

const fetchTerms = async (classId) => {
    try {
        const  user = useAuth((s) => s.user);
        if (!user) throw new Error("User not authenticated");
    } catch (error) {
        
    }
}