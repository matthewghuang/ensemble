import SourceType from "./source-type"

export default interface Update {
	src?: string,
	src_type?: SourceType,
	time?: number,
	paused?: boolean
}
