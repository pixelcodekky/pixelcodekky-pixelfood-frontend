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
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full lg:w-1/2 border p-5 rounded-lg">
          <UserProfileForm
          currentUser={currentUser} 
          onSave={updateUser} 
          isLoading={isUpdateLoading} />
        </div>
      </div>
    </>
    
  );
}
