/* 
 * Delete not yet official 100% released machine types
 */

/* 2022/05/15: m3-megamem-* and m3-ultramem-* */
DELETE FROM machinetypes WHERE name LIKE 'm3-%';

/* 2022/08/26: a2-ultragpu-* */
/* https://github.com/Cyclenerd/google-cloud-pricing-cost-calculator/issues/41 */
DELETE FROM machinetypes WHERE name LIKE 'a2-ultragpu-%';

/* 2022/09/11: m2-hypermem-* */
/* https://github.com/Cyclenerd/google-cloud-pricing-cost-calculator/issues/43 */
DELETE FROM machinetypes WHERE name LIKE 'm2-hypermem-%';


/* 
 * Delete not yet official 100% finished regions
 */


/*
 * Remove disconnected data centers
 */
/* us-central2 */
DELETE FROM machinetypes WHERE zone LIKE 'us-central2-%';
DELETE FROM disktypes    WHERE zone LIKE 'us-central2-%';
/* us-east2 */
DELETE FROM machinetypes WHERE zone LIKE 'us-east2-%';
DELETE FROM disktypes    WHERE zone LIKE 'us-east2-%';
/* us-east7 */
DELETE FROM machinetypes WHERE zone LIKE 'us-east7-%';
DELETE FROM disktypes    WHERE zone LIKE 'us-east7-%';
/* europe-west5 */
DELETE FROM machinetypes WHERE zone LIKE 'europe-west5-%';
DELETE FROM disktypes    WHERE zone LIKE 'europe-west5-%';