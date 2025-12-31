const fs = require('fs');
const path = require('path');

// Suppress SSL verification errors for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE_URL = 'https://ldapweb.iitd.ac.in/LDAP/courses';
const SEMESTER_PREFIX = '2502-';
const OUTPUT_FILE = path.join(__dirname, '../src/studentCourses.json');

async function fetchCourses() {
    console.log('Starting course fetch for semester:', SEMESTER_PREFIX);

    try {
        // 1. Fetch main list
        console.log(`Fetching ${BASE_URL}/gpaliases.html...`);
        const response = await fetch(`${BASE_URL}/gpaliases.html`);
        if (!response.ok) throw new Error(`Failed to fetch aliases: ${response.status}`);
        const text = await response.text();

        // 2. Parse course links
        const linkRegex = /href="([^"]+)"/g;
        const links = [];
        let match;
        while ((match = linkRegex.exec(text)) !== null) {
            if (match[1].startsWith(SEMESTER_PREFIX) && (match[1].endsWith('.shtml') || match[1].endsWith('.html'))) {
                links.push(match[1]);
            }
        }

        console.log(`Found ${links.length} course pages.`);

        // 3. Fetch each course page and build mapping
        const studentCourses = {}; // kerberos -> [courseCodes]
        const BATCH_SIZE = 50;

        for (let i = 0; i < links.length; i += BATCH_SIZE) {
            const batch = links.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${i + 1}-${Math.min(i + BATCH_SIZE, links.length)}...`);

            await Promise.all(batch.map(async (link) => {
                try {
                    const courseCodeMatch = link.match(/-([A-Z0-9]+)\./);
                    if (!courseCodeMatch) return;
                    const courseCode = courseCodeMatch[1];

                    const courseRes = await fetch(`${BASE_URL}/${link}`);
                    if (!courseRes.ok) return;
                    const courseText = await courseRes.text();

                    // Extract all words that look like Kerberos IDs (e.g. 3 lowercase letters + numbers, or just alphanumeric)
                    // Simple heuristic: split by non-alphanumeric, filter for length, or better:
                    // Look for the specific table entries if possible, or just scan words.
                    // The pages usually list IDs. Let's assume standard format text.
                    // Regex for Kerberos: [a-z0-9]+ usually.
                    // Let's grab everything that looks like a username from the body.
                    // But to be safer, let's look for the known pattern if possible or just parse loosely.
                    // Only parsing words that appear in the visible text might be enough.

                    // Actually, let's just use a simple regex for typical kerberos IDs (e.g. "cs1234567" or "mtt...").
                    // A broad regex for words: \b[a-z]{2,3}[0-9]{2}[0-9a-z]{4,}\b might be too specific.
                    // Let's try matching specific pattern from typical IITD LDAP pages.
                    // They are often in `uid=...` or just plain text lists.

                    // FALLBACK: Match everything that looks like a Kerberos ID.
                    // Format: [a-z0-9] but usually starts with dept code.
                    // Let's just collect all strings that matches ^[a-z0-9]+$? No too broad.

                    // Inspecting existing logic: "courseHtml.toLowerCase().includes(kerberosId.toLowerCase())"
                    // This implies we don't need to parse perfectly, just match.
                    // BUT for reverse index key, we NEED effective parsing.

                    // Let's assume the page contains IDs separated by whitespace or in tags.
                    // Valid kerberos: 3 letters + 2 numbers + ... e.g. "mcs232323", "ch1190123"
                    // Also faculty codes.

                    // Simple approach: Extract all alphanumeric strings of length 8-12 approx?
                    // Or scrape by HTML structure if consistent.
                    // Given I cannot see the page structure, robust tokenization is best.

                    // Let's try a regex that captures common IITD kerberos formats:
                    // [a-z]{2,3}[0-9]{2}[0-9a-z]* (e.g., cs123, mt123456)

                    const idRegex = /[a-z]{2,3}[0-9]{2}[0-9a-z]*/gi;
                    const potentialIds = courseText.match(idRegex) || [];

                    // Filter duplicates and valid looking ones
                    new Set(potentialIds).forEach(id => {
                        const kid = id.toLowerCase();
                        if (kid.length >= 5) { // min length filter
                            if (!studentCourses[kid]) studentCourses[kid] = [];
                            if (!studentCourses[kid].includes(courseCode)) {
                                studentCourses[kid].push(courseCode);
                            }
                        }
                    });

                } catch (err) {
                    console.error(`Error processing ${link}:`, err.message);
                }
            }));
        }

        // 4. Save to file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(studentCourses, null, 2));
        console.log(`Successfully saved courses for ${Object.keys(studentCourses).length} students to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

fetchCourses();
