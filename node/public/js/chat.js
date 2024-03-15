// room 에 들어가는 사람 수를 체크하는 함수
export const countPeople = (io, roomName) => {
    return io.sockets.adapter.rooms.get(roomName).size;
};