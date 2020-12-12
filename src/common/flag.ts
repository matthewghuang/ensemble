export const set_flag = (state: number, ...flags: number[]): number => {
	flags.forEach(flag => state |= flag)
	return state
}

export const unset_flag = (state: number, ...flags: number[]): number => {
	flags.forEach(flag => state &= (~flag))
	return state
}

export const has_flag = (state: number, ...flags: number[]): boolean => {
	flags.forEach(flag => {
		if (!(state & flag))
			return false
	})

	return true
}

export const toggle_flag = (state: number, ...flags: number[]): number => {
	flags.forEach(flag => state ^= flag)
	return state
}
