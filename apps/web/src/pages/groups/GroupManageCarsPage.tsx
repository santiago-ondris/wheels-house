import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";
import { getGroup, updateGroup, GroupData } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import CollectionSection from "../../components/user_profile/CollectionSection";
import toast from "react-hot-toast";

export default function GroupManageCarsPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const { user } = useAuth();
    const [group, setGroup] = useState<GroupData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Navigate to group detail page (not browser history)
    const navigateToGroupDetail = () => {
        if (group && user) {
            navigate(`/collection/${user.username}/group/${encodeURIComponent(group.name)}`);
        } else {
            navigate(`/collection/${user?.username}/groups`);
        }
    };

    // ScrollRestoration handles scroll automatically
    useEffect(() => {
        if (groupId) {
            fetchGroupData();
        }
    }, [groupId]);

    const fetchGroupData = async () => {
        try {
            const data = await getGroup(groupId!);
            setGroup(data);
        } catch (error) {
            console.error("Error fetching group:", error);
            toast.error("Error al cargar el grupo");
            navigateToGroupDetail();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSelection = async (selectedIds: number[]) => {
        try {
            if (!group?.groupId) return;


            await updateGroup(group.groupId, {
                name: group.name,
                description: group.description,
                featured: group.featured,
                picture: group.picture,
                order: group.order,
                cars: selectedIds
            });

            toast.success("Vehículos actualizados correctamente");
            navigateToGroupDetail();
        } catch (error) {
            console.error("Error saving group cars:", error);
            toast.error("Error al guardar cambios");
        }
    };

    // Use the navigateBack function directly
    const handleBack = navigateToGroupDetail;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    if (!group || !user) return null;

    // Get current car IDs
    const currentCarIds = group.cars?.map(c => c.carId!) || [];

    return (
        <div className="min-h-screen pb-8">
            <PageHeader
                title={`Gestionar: ${group.name}`}
                subtitle="Selecciona los autos que pertenecen a este grupo"
                icon={Folder}
                onBack={handleBack}
            />

            <div className="container mx-auto px-4">
                <CollectionSection
                    username={user.username}
                    isOwner={true}
                    mode="manage_group"
                    initialSelection={currentCarIds}
                    onSaveSelection={handleSaveSelection}
                />
            </div>
        </div>
    );
}
