
const { compare_string_yyyy_mm_dd_dates} = require("./date_utils");

test('compare_string_yyyy_mm_dd_dates test', async () => {
    let data1 = "2026-05-01";
    let data2 = "2025-05-05";
    
    expect(compare_string_yyyy_mm_dd_dates(data1, data2)).toBe(true);

    data1 = "2026-05-01";
    data2 = "2026-04-05";

    expect(compare_string_yyyy_mm_dd_dates(data1, data2)).toBe(true);


    data1 = "2026-04-01";
    data2 = "2026-04-05";

    expect(compare_string_yyyy_mm_dd_dates(data1, data2)).toBe(false);

    data1 = "2026-04-06";
    data2 = "2026-04-05";

    expect(compare_string_yyyy_mm_dd_dates(data1, data2)).toBe(true);
});