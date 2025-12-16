import { m } from "$lib/paraglide/messages";
import { getLocale } from "$lib/paraglide/runtime";

export const wasPostedThisWeek = (date: Date) => {
	const now = new Date();
	const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	return date >= oneWeekAgo;
};

export const postedAt = (date: Date) => {
	if (wasPostedThisWeek(date)) return m.published_this_week();

	const now = new Date();
	if (date.getFullYear() === now.getFullYear()) {
		return date.toLocaleDateString(getLocale(), { month: "long" });
	}

	return date.toLocaleDateString(getLocale(), {
		month: "long",
		year: "numeric",
	});
};

export const daysAgo = (date: Date) => {
	const today = new Date();
	const days = Math.round(
		(today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
	);
	if (days === 0) return m.today();
	if (days === 1) return m.yesterday();
	return m.days_ago({ days });
};

export const timeAgo = (date: Date) => {
	const hours = Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years) {
		return years === 1 ? m.this_year() : m.years_ago({ years });
	}

	if (months >= 2) {
		return m.months_ago({ months });
	}

	if (weeks >= 3) {
		return m.this_month();
	}

	if (weeks >= 2) {
		return m.weeks_ago({ weeks });
	}

	if (days >= 6) {
		return m.this_week();
	}

	if (days >= 2) {
		return m.days_ago({ days });
	}

	if (hours >= 12) {
		return m.today();
	}

	if (hours) {
		return hours === 1 ? m.hour_ago() : m.hours_ago({ hours });
	}

	return m.just_now();
};

export const readyInDays = (date: Date) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const days = Math.floor(
		(date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);
	if (days === 0)
		return m.ready_at({
			time: date.toLocaleTimeString(getLocale(), {
				hour: "2-digit",
				minute: "2-digit",
			}),
		});
	if (days === 1) return m.tommorow();
	return m.ready_in_x_days({ days });
};
