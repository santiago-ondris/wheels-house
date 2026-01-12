import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { getPublicProfile, PublicProfile } from "../../services/profile.service";
import ProfileHero from "../../components/user_profile/ProfileHero";
import GroupsSection from "../../components/user_profile/GroupsSection";
import CollectionSection from "../../components/user_profile/CollectionSection";
import UserNotFoundPage from "../user/UserNotFoundPage";

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isOwner = user?.username === username;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;

            setIsLoading(true);
            setNotFound(false);

            try {
                const data = await getPublicProfile(username);
                setProfile(data);
            } catch (error: any) {
                if (error?.statusCode === 404 || error?.status === 404) {
                    setNotFound(true);
                } else {
                    console.error("Error fetching profile:", error);
                    setNotFound(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    {/* Hero skeleton */}
                    <div className="h-48 bg-white/5 rounded-2xl" />
                    {/* Groups skeleton */}
                    <div className="h-32 bg-white/5 rounded-xl" />
                    {/* Collection skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-4/3 bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !profile) {
        return <UserNotFoundPage />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 pb-20"
        >
            <ProfileHero
                username={profile.username}
                firstName={profile.firstName}
                lastName={profile.lastName}
                biography={profile.biography}
                picture={profile.picture}
                createdDate={profile.createdDate}
                totalCars={profile.totalCars}
                totalGroups={profile.totalGroups}
                isOwner={isOwner}
                onEditClick={() => navigate("/settings")}
            />

            <GroupsSection
                username={profile.username}
                totalGroups={profile.totalGroups}
                isOwner={isOwner}
            />

            <CollectionSection
                username={profile.username}
                isOwner={isOwner}
            />
        </motion.div>
    );
}
