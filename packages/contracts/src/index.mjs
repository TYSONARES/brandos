export function createContractSummary() {
  return {
    name: 'contracts',
    source: 'schemas and fixtures',
    owns: ['schema references', 'fixture references', 'contract metadata']
  };
}
