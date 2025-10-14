import React from 'react';
import { LiveKitRoom, GridLayout, ParticipantTile, ControlBar, useRoomContext, useLocalParticipant, useParticipants } from '@livekit/components-react';
import { Room } from 'livekit-client';

const MyVideoConference = ({ token, serverUrl, room }) => {
  if (!token || !room) {
    return <div>Loading video conference...</div>;
  }

  return (
    <LiveKitRoom
      room={room} // useWebRTC 훅에서 생성된 room 객체를 전달
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      data-lk-theme="default"
    >
      <VideoGridLayout />
      <ControlBar />
    </LiveKitRoom>
  );
};

const VideoGridLayout = () => {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  // 로컬 참여자를 가장 먼저 렌더링하도록 정렬
  const sortedParticipants = [localParticipant, ...participants.filter(p => p.identity !== localParticipant.identity)];

  return (
    <GridLayout participants={sortedParticipants}>
      {sortedParticipants.map((participant) => (
        <ParticipantTile key={participant.identity} participant={participant} />
      ))}
    </GridLayout>
  );
};

export default MyVideoConference;
