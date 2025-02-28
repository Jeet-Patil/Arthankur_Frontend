import React from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const Meeting = () => {
    const { meetingId } = useParams();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name') || 'User';

    const myMeeting = async (element) => {
        // Generate Kit Token
        const appID = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            meetingId,
            userId,
            userName
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
        });
    };

    return (
        <div className="h-screen">
            <div 
                className="h-full w-full"
                ref={myMeeting}
            />
        </div>
    );
};

export default Meeting; 