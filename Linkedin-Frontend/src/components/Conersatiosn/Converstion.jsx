import React, { useEffect, useState } from "react";

// Avatar with coloured initial fallback
const Avatar = ({ src, name = '', size = 12 }) => {
  const [broken, setBroken] = useState(!src);
  const initial = (name || '?')[0].toUpperCase();
  const colors = ['bg-purple-600','bg-blue-600','bg-green-600','bg-red-500','bg-yellow-500','bg-pink-500'];
  const color  = colors[initial.charCodeAt(0) % colors.length];
  if (!src || broken) {
    return (
      <div className={`w-${size} h-${size} rounded-full ${color} flex items-center justify-center text-white font-bold text-base shrink-0`}>
        {initial}
      </div>
    );
  }
  return (
    <img
      className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
      src={src}
      alt={name}
      onError={() => setBroken(true)}
    />
  );
};

export default function Conversation({item, ownData, handleSelectedConv, activeConID}) {
   const [memberData, setMemberData] = useState(null)

   useEffect(() => {
    let ownId = ownData?._id?.toString();
    // Use string comparison for MongoDB ObjectIds
    let arr = item?.members?.filter((it) => it._id?.toString() !== ownId);
    setMemberData(arr?.[0] || null);
   }, [item, ownData])  // ✅ proper dependency array — prevents infinite loop

   const handleClickFunction = async () => {
     handleSelectedConv(item?._id, memberData)
   }

    return (
        <div>
            <div
              onClick={handleClickFunction}
              className={`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConID === item?._id ? 'bg-gray-200' : ''}`}
            >
                <div className='shrink-0'>
                  <Avatar src={memberData?.profile_pic} name={memberData?.f_name} size={12} />
                </div>
                <div>
                    <div className='text-md font-medium'>{memberData?.f_name || 'Unknown'}</div>
                    <div className='text-sm text-gray-500'>{memberData?.headline}</div>
                </div>
            </div>
        </div>
    )
}