import { useGetUser, useUpdateMyUser } from "@/api/MyUserApi";
import { UserProfileForm } from "@/forms/user_profile_form/UserProfileForm"


export const UserProfilepage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) return <div>loading...</div>;

  if(!currentUser){
    return <span>User Information can't find.</span>
  }

  return (
    <UserProfileForm
      currentUser={currentUser} 
      onSave={updateUser} 
      isLoading={isUpdateLoading} />
  );
}
