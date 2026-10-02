class EvidenceSystem:
  def __init__(self,evidence):
    self.evidence=evidence 

  def show_evidence(self):
    print("\n available evidence:")

    for evidence in self.evidence:
      if evidence["status"]=="unlocked":
        print(f'{evidence["id"]}: {evidence["name"]}')

  def unlock_evidence(self, evidence_ids):
        for evidence in self.evidence:
            if evidence["id"] in evidence_ids:
                evidence["status"] = "unlocked"

  def inspect_evidence(self):
    evidence_id = input("\nEnter evidence ID to inspect: ")

    for evidence in self.evidence:
      if evidence["id"]== evidence_id:
        print(" \n Evidence detail")
        print("Name:", evidence["name"])
        print("type:" , evidence["type"])
        print("Discription:" , evidence["description"])
        return evidence_id 


    print("evidence not found")
