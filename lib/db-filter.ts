// Quote a value for a PostgREST or()/and() filter string, so commas, dots or parentheses in it (e.g. in an email)
// can't change the filter (21 Nov audit).
export const pgq = (v: string) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
