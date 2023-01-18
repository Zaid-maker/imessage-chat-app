import { ParticipantPopulated } from "../../../server/src/util/types";

/**
 * It takes an array of participants and a user id, and returns a string of all the usernames of the
 * participants except the one with the given user id
 * @param participants - Array<ParticipantPopulated>
 * @param {string} myUserId - string
 * @returns A string
 */
export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);
  return usernames.join(", ");
};
