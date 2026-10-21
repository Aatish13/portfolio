/**
 * AnalyticsService — thin wrapper around GA4's window.gtag.
 *
 * Rules:
 *  - Never throws: silently no-ops if gtag is blocked or unavailable.
 *  - Never logs PII: message content is never sent, only metadata (length, topic).
 *  - Single responsibility: all analytics calls flow through one place.
 */

const track = (event, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event, { event_category: 'Chat', ...params });
};

export const Analytics = {
    /** User opened the chat widget */
    chatOpened: () =>
        track('chat_opened'),

    /** User closed the chat widget; duration = seconds the window was open */
    chatClosed: (durationSeconds) =>
        track('chat_closed', { duration_seconds: Math.round(durationSeconds) }),

    /** User submitted a message (never logs content, only character count) */
    messageSent: (messageLength) =>
        track('chat_message_sent', { message_length: messageLength }),

    /** User clicked a follow-up suggestion chip (logs the prompt text – not PII) */
    followUpClicked: (prompt) =>
        track('chat_followup_clicked', { prompt_text: prompt.slice(0, 100) }),

    /** In-browser AI model finished downloading and is ready */
    modelReady: (loadTimeMs, isWebGPU) =>
        track('ai_model_ready', { load_time_ms: Math.round(loadTimeMs), is_webgpu: isWebGPU }),

    /** User sent a message via the hero AI search box */
    aiSearchUsed: (messageLength) =>
        track('ai_search_used', { message_length: messageLength }),
};
