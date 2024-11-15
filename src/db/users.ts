import drizzle from "../lib/db_conn.ts"
import { usersTable } from "../db/users.sql.ts"
import { eq } from "drizzle-orm"
import { userPrefsTable } from "./userprefs.sql.ts"
import type { UserPublicProfile, UserWithPrefsAndStatus } from "../lib/types.d.ts"
import { specialStatusTable } from "./specialstatus.sql.ts"
import logger from "../util/logger.ts"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserById(id: string): Promise<UserWithPrefsAndStatus> {
    const users = await drizzle
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .leftJoin(
            userPrefsTable,
            eq(usersTable.prefs, userPrefsTable.id),
        ).leftJoin(
            specialStatusTable,
            eq(usersTable.specialStatus, specialStatusTable.title),
        ).limit(1)
    return <UserWithPrefsAndStatus> users[0]
}

export async function updateNickname(
    id: string,
    nickname: string,
): Promise<boolean> {
    logger.debug(`Updating nickname for user ${id} to ${nickname}`)
    await drizzle
        .update(usersTable)
        .set({ nickname })
        .where(eq(usersTable.id, id))
    return Promise.resolve(true)
}

export async function selectUserProfileById(id: string): Promise<UserPublicProfile> {
    const users = await drizzle
        .select({
            firstName: usersTable.firstName,
            nickname: usersTable.nickname,
            bio: usersTable.bio,
            specialStatus: usersTable.specialStatus,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1)
    return <UserPublicProfile> users[0]
}
