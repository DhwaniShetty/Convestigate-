export const CASE_SCHEMAS = {
  "001": {
    "P01": {
      "type": "timeline_and_maintenance_analysis",
      "endpoint": "case001-timeline-maintenance",
      "schema": {
        "type": "compound",
        "fields": {
          "timeline_sequence_correct": {
            "type": "boolean",
            "value": true
          },
          "repair_inconsistency_identified": {
            "type": "boolean",
            "value": true
          },
          "simple_accident_explanation_supported": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P02": {
      "type": "motive_analysis",
      "endpoint": "case001-motive-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "financial_motive_supported": {
            "type": "boolean",
            "value": true
          },
          "estate_change_relevant": {
            "type": "boolean",
            "value": true
          },
          "account_access_links_adrian": {
            "type": "boolean",
            "value": true
          },
          "family_history_proves_motive": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P03": {
      "type": "forensic_analysis",
      "endpoint": "case001-damage-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "damage_inconsistent_with_simple_failure": {
            "type": "boolean",
            "value": true
          },
          "sabotage_opportunity_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "timeline_and_document_analysis",
      "endpoint": "case001-communication-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "communication_timing_contradicts_adrian": {
            "type": "boolean",
            "value": true
          },
          "eleanor_suspected_adrian_financial_irregularities": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case001-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "adrian_is_supported_suspect": {
            "type": "boolean",
            "value": true
          },
          "revised_statement_contradicts_original": {
            "type": "boolean",
            "value": true
          },
          "h3_is_best_supported_hypothesis": {
            "type": "boolean",
            "value": true
          },
          "exact_death_mechanism_unresolved": {
            "type": "boolean",
            "value": true
          }
        }
      }
    }
  },
  "002": {
    "P01": {
      "type": "contradiction_analysis",
      "endpoint": "case002-contradiction-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "scene_contradiction_identified": {
            "type": "boolean",
            "value": true
          },
          "chain_of_custody_gap_identified": {
            "type": "boolean",
            "value": true
          },
          "evidence_transfer_discrepancy_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "forensic_analysis",
      "endpoint": "case002-forensic-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "missing_weapon_identified": {
            "type": "boolean",
            "value": true
          },
          "trajectory_challenges_single_attacker": {
            "type": "boolean",
            "value": true
          },
          "multiple_positions_indicated": {
            "type": "boolean",
            "value": true
          },
          "physical_evidence_reliability_questioned": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "provenance_review",
      "endpoint": "case002-provenance-review",
      "schema": {
        "type": "compound",
        "fields": {
          "independent_storage_evidence_identified": {
            "type": "boolean",
            "value": true
          },
          "arjun_evidence_provenance_questioned": {
            "type": "boolean",
            "value": true
          },
          "second_scene_photos_contradict_official_record": {
            "type": "boolean",
            "value": true
          },
          "original_arjun_narrative_not_fully_reliable": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "timeline_and_access_mapping",
      "endpoint": "case002-timeline-access",
      "schema": {
        "type": "compound",
        "fields": {
          "daniel_timeline_requires_verification": {
            "type": "boolean",
            "value": true
          },
          "vikram_evidence_access_identified": {
            "type": "boolean",
            "value": true
          },
          "access_does_not_prove_murder_involvement": {
            "type": "boolean",
            "value": true
          },
          "investigation_record_compromised": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case002-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "H1": {
            "type": "string",
            "value": "contradicted"
          },
          "H2": {
            "type": "string",
            "value": "supported"
          },
          "H3": {
            "type": "string",
            "value": "unresolved"
          },
          "H4": {
            "type": "string",
            "value": "supported"
          },
          "H5": {
            "type": "string",
            "value": "contradicted"
          },
          "H6": {
            "type": "string",
            "value": "supported"
          }
        }
      }
    }
  },
  "003": {
    "P01": {
      "type": "timeline_reconstruction",
      "endpoint": "case003-timeline-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "pub_encounter_identified": {
            "type": "boolean",
            "value": true
          },
          "unknown_man_left_with_ronnie": {
            "type": "boolean",
            "value": true
          },
          "job_call_identified": {
            "type": "boolean",
            "value": true
          },
          "unknown_man_inside_home": {
            "type": "boolean",
            "value": true
          },
          "residence_call_identified": {
            "type": "boolean",
            "value": true
          },
          "family_disappearance_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "evidence_classification",
      "endpoint": "case003-evidence-classification",
      "schema": {
        "type": "compound",
        "fields": {
          "job_offer_observed": {
            "type": "boolean",
            "value": true
          },
          "genuine_job_offer_not_established": {
            "type": "boolean",
            "value": true
          },
          "family_packing_identified": {
            "type": "boolean",
            "value": true
          },
          "packing_does_not_prove_voluntary_disappearance": {
            "type": "boolean",
            "value": true
          },
          "jacket_logo_unverified": {
            "type": "boolean",
            "value": true
          },
          "unknown_man_description_incomplete": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "field_investigation",
      "endpoint": "case003-field-investigation",
      "schema": {
        "type": "compound",
        "fields": {
          "logging_camp_not_confirmed": {
            "type": "boolean",
            "value": true
          },
          "forestry_search_results_identified": {
            "type": "boolean",
            "value": true
          },
          "job_location_unverified": {
            "type": "boolean",
            "value": true
          },
          "absence_of_matching_camp_weakens_original_theory": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "institutional_review",
      "endpoint": "case003-institutional-review",
      "schema": {
        "type": "compound",
        "fields": {
          "initial_voluntary_departure_theory_identified": {
            "type": "boolean",
            "value": true
          },
          "incorrect_family_found_report_identified": {
            "type": "boolean",
            "value": true
          },
          "communication_failure_identified": {
            "type": "boolean",
            "value": true
          },
          "investigation_impact_recognized": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case003-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "unresolved"
              },
              "H2": {
                "type": "string",
                "value": "unresolved"
              },
              "H3": {
                "type": "string",
                "value": "unresolved"
              },
              "H4": {
                "type": "string",
                "value": "unresolved"
              },
              "H5": {
                "type": "string",
                "value": "unresolved"
              },
              "H6": {
                "type": "string",
                "value": "unresolved"
              }
            }
          },
          "final_conclusion": {
            "type": "string",
            "value": "insufficient_evidence"
          }
        }
      }
    }
  },
  "004": {
    "P01": {
      "type": "evidence_mapping",
      "endpoint": "case004-digital-alibi-map",
      "schema": {
        "type": "compound",
        "fields": {
          "rhea_alibi_identified": {
            "type": "boolean",
            "value": true
          },
          "vikas_alibi_identified": {
            "type": "boolean",
            "value": true
          },
          "neha_alibi_identified": {
            "type": "boolean",
            "value": true
          },
          "digital_records_identified": {
            "type": "boolean",
            "value": true
          },
          "alibi_sources_compared": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "timeline_reconciliation",
      "endpoint": "case004-time-of-death-reconciliation",
      "schema": {
        "type": "compound",
        "fields": {
          "time_of_death_window_identified": {
            "type": "boolean",
            "value": true
          },
          "rhea_alibi_window_tested": {
            "type": "boolean",
            "value": true
          },
          "vikas_alibi_window_tested": {
            "type": "boolean",
            "value": true
          },
          "neha_alibi_window_tested": {
            "type": "boolean",
            "value": true
          },
          "full_window_coverage_compared": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "digital_provenance_analysis",
      "endpoint": "case004-metadata-authentication",
      "schema": {
        "type": "compound",
        "fields": {
          "device_presence_distinguished": {
            "type": "boolean",
            "value": true
          },
          "rhea_device_alibi_questioned": {
            "type": "boolean",
            "value": true
          },
          "companion_phone_carry_identified": {
            "type": "boolean",
            "value": true
          },
          "retreat_gap_identified": {
            "type": "boolean",
            "value": true
          },
          "toll_footage_connection_identified": {
            "type": "boolean",
            "value": true
          },
          "person_presence_not_assumed": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "motive_analysis",
      "endpoint": "case004-financial-motive-audit",
      "schema": {
        "type": "compound",
        "fields": {
          "equity_dispute_examined": {
            "type": "boolean",
            "value": true
          },
          "vikas_buyout_conflict_examined": {
            "type": "boolean",
            "value": true
          },
          "neha_termination_fallout_examined": {
            "type": "boolean",
            "value": true
          },
          "motives_compared_independently": {
            "type": "boolean",
            "value": true
          },
          "motive_not_treated_as_proof": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case004-final-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "rhea_alibi_failed_independent_corroboration": {
            "type": "boolean",
            "value": true
          },
          "vikas_alibi_independently_corroborated": {
            "type": "boolean",
            "value": true
          },
          "neha_alibi_independently_corroborated": {
            "type": "boolean",
            "value": true
          },
          "phone_carry_explanation_identified": {
            "type": "boolean",
            "value": true
          },
          "rhea_identified_as_killer": {
            "type": "boolean",
            "value": true
          },
          "exact_return_route_unresolved": {
            "type": "boolean",
            "value": true
          },
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "supported"
              },
              "H2": {
                "type": "string",
                "value": "contradicted"
              },
              "H3": {
                "type": "string",
                "value": "contradicted"
              },
              "H4": {
                "type": "string",
                "value": "supported"
              }
            }
          }
        }
      }
    }
  },
  "005": {
    "P01": {
      "type": "comparative_analysis",
      "endpoint": "case005-comparative-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "profile_x_repeated": {
            "type": "boolean",
            "value": true
          },
          "profile_x_questioned": {
            "type": "boolean",
            "value": true
          },
          "profile_y_competing": {
            "type": "boolean",
            "value": true
          },
          "profile_y_authenticated": {
            "type": "boolean",
            "value": true
          },
          "profile_conflict_identified": {
            "type": "boolean",
            "value": true
          },
          "repetition_does_not_prove_authenticity": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "provenance_tracing",
      "endpoint": "case005-provenance-tracing",
      "schema": {
        "type": "compound",
        "fields": {
          "sample_origin_traced": {
            "type": "boolean",
            "value": true
          },
          "initial_handling_identified": {
            "type": "boolean",
            "value": true
          },
          "sample_provenance_established": {
            "type": "boolean",
            "value": true
          },
          "provenance_chain_distinguished_from_result": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "chain_analysis",
      "endpoint": "case005-chain-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "laboratory_processing_identified": {
            "type": "boolean",
            "value": true
          },
          "handling_steps_identified": {
            "type": "boolean",
            "value": true
          },
          "contamination_point_identified": {
            "type": "boolean",
            "value": true
          },
          "substitution_point_identified": {
            "type": "boolean",
            "value": true
          },
          "chain_risk_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "evidentiary_standard",
      "endpoint": "case005-evidentiary-standard",
      "schema": {
        "type": "compound",
        "fields": {
          "profile_x_not_authenticated": {
            "type": "boolean",
            "value": true
          },
          "profile_y_authenticated": {
            "type": "boolean",
            "value": true
          },
          "authentication_gap_identified": {
            "type": "boolean",
            "value": true
          },
          "repeated_reports_not_equivalent_to_authentication": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case005-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "contradicted"
              },
              "H2": {
                "type": "string",
                "value": "unresolved"
              },
              "H3": {
                "type": "string",
                "value": "unresolved"
              },
              "H4": {
                "type": "string",
                "value": "supported"
              }
            }
          },
          "final_conclusion": {
            "type": "string",
            "value": "profile_y_authenticated"
          }
        }
      }
    }
  },
  "006": {
    "P01": {
      "type": "evidence_generation",
      "endpoint": "case006-evidence-generation",
      "schema": {
        "type": "compound",
        "fields": {
          "ten_dollar_balance_explained": {
            "type": "boolean",
            "value": true
          },
          "withdrawal_interpretation_generated": {
            "type": "boolean",
            "value": true
          },
          "vehicle_inventory_checked": {
            "type": "boolean",
            "value": true
          },
          "minimal_clothing_identified": {
            "type": "boolean",
            "value": true
          },
          "missing_valuables_identified": {
            "type": "boolean",
            "value": true
          },
          "empty_car_contradiction_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "evidence_classification",
      "endpoint": "case006-evidence-classification",
      "schema": {
        "type": "compound",
        "fields": {
          "identification_left_in_vehicle_identified": {
            "type": "boolean",
            "value": true
          },
          "planned_disappearance_contradiction_identified": {
            "type": "boolean",
            "value": true
          },
          "silent_call_identified": {
            "type": "boolean",
            "value": true
          },
          "silent_call_low_reliability_identified": {
            "type": "boolean",
            "value": true
          },
          "caller_identity_unproven": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "timeline_reconstruction",
      "endpoint": "case006-timeline-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "credit_card_purchase_identified": {
            "type": "boolean",
            "value": true
          },
          "travel_sequence_identified": {
            "type": "boolean",
            "value": true
          },
          "atlanta_terminal_identified": {
            "type": "boolean",
            "value": true
          },
          "car_abandoned_near_terminal": {
            "type": "boolean",
            "value": true
          },
          "last_reliable_journey_segment_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "hypothesis_test",
      "endpoint": "case006-hypothesis-test",
      "schema": {
        "type": "compound",
        "fields": {
          "atlanta_wisconsin_gap_identified": {
            "type": "boolean",
            "value": true
          },
          "route_unexplained": {
            "type": "boolean",
            "value": true
          },
          "voluntary_disappearance_theory_tested": {
            "type": "boolean",
            "value": true
          },
          "interception_theory_tested": {
            "type": "boolean",
            "value": true
          },
          "exact_route_unresolved": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case006-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "contradicted"
              },
              "H2": {
                "type": "string",
                "value": "contradicted"
              },
              "H3": {
                "type": "string",
                "value": "supported"
              },
              "H4": {
                "type": "string",
                "value": "supported"
              }
            }
          },
          "final_conclusion": {
            "type": "string",
            "value": "genuine_disappearance_then_unresolved_interception"
          }
        }
      }
    }
  },
  "007": {
    "P01": {
      "type": "timeline_reconstruction",
      "endpoint": "case007-timeline-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "afternoon_departure_identified": {
            "type": "boolean",
            "value": true
          },
          "evening_toll_record_identified": {
            "type": "boolean",
            "value": true
          },
          "night_final_vehicle_movement_identified": {
            "type": "boolean",
            "value": true
          },
          "following_morning_discovery_identified": {
            "type": "boolean",
            "value": true
          },
          "final_drive_sequence_reconstructed": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "forensic_analysis",
      "endpoint": "case007-forensic-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "daniel_blood_identified": {
            "type": "boolean",
            "value": true
          },
          "rear_seat_blood_event_identified": {
            "type": "boolean",
            "value": true
          },
          "second_blood_type_identified": {
            "type": "boolean",
            "value": true
          },
          "second_contributor_considered": {
            "type": "boolean",
            "value": true
          },
          "two_blood_sources_interpreted": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "trace_evidence_analysis",
      "endpoint": "case007-trace-evidence-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "partial_fingerprint_identified": {
            "type": "boolean",
            "value": true
          },
          "possible_second_person_connection_identified": {
            "type": "boolean",
            "value": true
          },
          "fingerprint_is_incomplete": {
            "type": "boolean",
            "value": true
          },
          "fingerprint_not_conclusive_identified": {
            "type": "boolean",
            "value": true
          },
          "identity_of_second_person_unestablished": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "forensic_reconstruction",
      "endpoint": "case007-forensic-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "vehicle_submersion_identified": {
            "type": "boolean",
            "value": true
          },
          "vehicle_stab_damage_identified": {
            "type": "boolean",
            "value": true
          },
          "final_vehicle_movement_reconstructed": {
            "type": "boolean",
            "value": true
          },
          "stab_pattern_interpreted": {
            "type": "boolean",
            "value": true
          },
          "physical_scene_supports_second_person": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case007-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "contradicted"
              },
              "H2": {
                "type": "string",
                "value": "unresolved"
              },
              "H3": {
                "type": "string",
                "value": "supported"
              }
            }
          },
          "final_conclusion": {
            "type": "string",
            "value": "ambiguous_suicide_vs_homicide"
          }
        }
      }
    }
  },
  "008": {
    "P01": {
      "type": "timeline",
      "endpoint": "timeline",
      "schema": {
        "type": "generic",
        "component": "p01Timeline"
      }
    },
    "P02": {
      "type": "behavior_comparison",
      "endpoint": "employment",
      "schema": {
        "type": "compound",
        "fields": {
          "directly_observed": {
            "type": "list",
            "value": [
              "Bryce was upright, ambulatory, and verbally responsive",
              "Bryce declined further roadside assistance"
            ]
          },
          "narrative_added_afterward": {
            "type": "list",
            "value": [
              "That Bryce was 'clearly suicidal'",
              "That the encounter proves intent to disappear"
            ]
          }
        }
      }
    },
    "P03": {
      "type": "forensic_analysis",
      "endpoint": "connection",
      "schema": {
        "type": "generic",
        "component": "p03Connection"
      }
    },
    "P04": {
      "type": "field_evidence_analysis",
      "endpoint": "contradictory",
      "schema": {
        "type": "generic",
        "component": "p04Witness"
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "missing-record",
      "schema": {
        "type": "generic",
        "component": "p05Missing"
      }
    }
  },
  "009": {
    "P01": {
      "type": "object_analysis",
      "endpoint": "object-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "matches_recorded_vehicle": {
            "type": "boolean",
            "value": false
          },
          "indicates_deliberate_route": {
            "type": "boolean",
            "value": true
          },
          "supports_confusion_explanation": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P02": {
      "type": "pattern_mapping",
      "endpoint": "pattern-mapping",
      "schema": {
        "type": "compound",
        "fields": {
          "route_is_deliberate": {
            "type": "boolean",
            "value": true
          },
          "valuables_remained_with_blair": {
            "type": "boolean",
            "value": true
          },
          "pattern_is_not_ordinary_tourism": {
            "type": "boolean",
            "value": true
          },
          "robbery_explanation_supported": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P03": {
      "type": "timeline_reconstruction",
      "endpoint": "case009-timeline-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "check_in_establishes_time_window": {
            "type": "boolean",
            "value": true
          },
          "forty_minute_gap_is_unexplained": {
            "type": "boolean",
            "value": true
          },
          "gap_is_significant": {
            "type": "boolean",
            "value": true
          },
          "room_events_are_fully_known": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P04": {
      "type": "hypothesis_test",
      "endpoint": "case009-hypothesis-test",
      "schema": {
        "type": "compound",
        "fields": {
          "planned_route_supported": {
            "type": "boolean",
            "value": true
          },
          "disorientation_explanation_supported": {
            "type": "boolean",
            "value": false
          },
          "robbery_explanation_supported": {
            "type": "boolean",
            "value": false
          },
          "intended_meeting_supported": {
            "type": "boolean",
            "value": true
          },
          "meeting_identity_established": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case009-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "coordinated_pattern_supported": {
            "type": "boolean",
            "value": true
          },
          "randomness_explanation_supported": {
            "type": "boolean",
            "value": false
          },
          "intended_meeting_supported": {
            "type": "boolean",
            "value": true
          },
          "other_participant_identified": {
            "type": "boolean",
            "value": false
          },
          "killer_identity_established": {
            "type": "boolean",
            "value": false
          }
        }
      }
    }
  },
  "010": {
    "P01": {
      "type": "comparative_analysis",
      "endpoint": "case010-comparative-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "case_a_compared": {
            "type": "boolean",
            "value": true
          },
          "case_b_compared": {
            "type": "boolean",
            "value": true
          },
          "case_c_compared": {
            "type": "boolean",
            "value": true
          },
          "case_d_compared": {
            "type": "boolean",
            "value": true
          },
          "case_e_compared": {
            "type": "boolean",
            "value": true
          },
          "locations_dates_circumstances_compared": {
            "type": "boolean",
            "value": true
          },
          "victim_pattern_documented": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "comparative_analysis",
      "endpoint": "case010-comparative-similarity",
      "schema": {
        "type": "compound",
        "fields": {
          "genuine_similarities_identified": {
            "type": "boolean",
            "value": true
          },
          "superficial_similarities_identified": {
            "type": "boolean",
            "value": true
          },
          "wound_patterns_compared": {
            "type": "boolean",
            "value": true
          },
          "circumstances_compared": {
            "type": "boolean",
            "value": true
          },
          "meaningful_differences_identified": {
            "type": "boolean",
            "value": true
          },
          "single_offender_not_established": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "source_analysis",
      "endpoint": "case010-source-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "letter_claims_separated_from_facts": {
            "type": "boolean",
            "value": true
          },
          "letter_authenticity_questioned": {
            "type": "boolean",
            "value": true
          },
          "handwriting_provenance_considered": {
            "type": "boolean",
            "value": true
          },
          "ink_provenance_considered": {
            "type": "boolean",
            "value": true
          },
          "distribution_history_considered": {
            "type": "boolean",
            "value": true
          },
          "single_perpetrator_authorship_not_established": {
            "type": "boolean",
            "value": true
          },
          "press_influence_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "hypothesis_management",
      "endpoint": "case010-hypothesis-management",
      "schema": {
        "type": "compound",
        "fields": {
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "unresolved"
              },
              "H2": {
                "type": "string",
                "value": "unresolved"
              },
              "H3": {
                "type": "string",
                "value": "supported"
              },
              "H4": {
                "type": "string",
                "value": "supported"
              }
            }
          }
        }
      }
    },
    "P05": {
      "type": "conclusion_writing",
      "endpoint": "case010-conclusion-writing",
      "schema": {
        "type": "compound",
        "fields": {
          "established_facts_listed": {
            "type": "boolean",
            "value": true
          },
          "plausible_inferences_listed": {
            "type": "boolean",
            "value": true
          },
          "unresolved_questions_listed": {
            "type": "boolean",
            "value": true
          },
          "single_offender_requirements_identified": {
            "type": "boolean",
            "value": true
          },
          "single_offender_not_proven": {
            "type": "boolean",
            "value": true
          },
          "letter_authenticity_unresolved": {
            "type": "boolean",
            "value": true
          },
          "case_linkage_unresolved": {
            "type": "boolean",
            "value": true
          }
        }
      }
    }
  },
  "011": {
    "P01": {
      "type": "spatial_analysis",
      "endpoint": "case011-spatial-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "attack_1_location_identified": {
            "type": "boolean",
            "value": true
          },
          "attack_2_location_identified": {
            "type": "boolean",
            "value": true
          },
          "attack_3_location_identified": {
            "type": "boolean",
            "value": true
          },
          "attack_4_location_identified": {
            "type": "boolean",
            "value": true
          },
          "attack_locations_compared": {
            "type": "boolean",
            "value": true
          },
          "victim_relationships_considered": {
            "type": "boolean",
            "value": true
          },
          "spatial_pattern_documented": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "document_reconstruction",
      "endpoint": "case011-document-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "jazz_letter_reconstructed": {
            "type": "boolean",
            "value": true
          },
          "threat_content_identified": {
            "type": "boolean",
            "value": true
          },
          "specified_night_identified": {
            "type": "boolean",
            "value": true
          },
          "citywide_jazz_response_identified": {
            "type": "boolean",
            "value": true
          },
          "letter_behavioral_effect_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "source_analysis",
      "endpoint": "case011-source-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "letter_authorship_examined": {
            "type": "boolean",
            "value": true
          },
          "letter_provenance_examined": {
            "type": "boolean",
            "value": true
          },
          "attacker_letter_connection_tested": {
            "type": "boolean",
            "value": true
          },
          "letter_writer_identity_unestablished": {
            "type": "boolean",
            "value": true
          },
          "single_author_hypothesis_not_proven": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "comparative_analysis",
      "endpoint": "case011-comparative-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "attack_1_compared": {
            "type": "boolean",
            "value": true
          },
          "attack_2_compared": {
            "type": "boolean",
            "value": true
          },
          "attack_3_compared": {
            "type": "boolean",
            "value": true
          },
          "attack_4_compared": {
            "type": "boolean",
            "value": true
          },
          "weapon_patterns_compared": {
            "type": "boolean",
            "value": true
          },
          "victim_patterns_compared": {
            "type": "boolean",
            "value": true
          },
          "single_perpetrator_not_assumed": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "social_dynamics_model",
      "endpoint": "case011-social-dynamics-model",
      "schema": {
        "type": "compound",
        "fields": {
          "public_panic_identified": {
            "type": "boolean",
            "value": true
          },
          "jazz_response_identified": {
            "type": "boolean",
            "value": true
          },
          "threat_influence_on_behavior_identified": {
            "type": "boolean",
            "value": true
          },
          "attacker_hypothesis_compared": {
            "type": "boolean",
            "value": true
          },
          "letter_writer_hypothesis_compared": {
            "type": "boolean",
            "value": true
          },
          "public_behavior_not_treated_as_attacker_identity_proof": {
            "type": "boolean",
            "value": true
          },
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "unresolved"
              },
              "H2": {
                "type": "string",
                "value": "unresolved"
              },
              "H3": {
                "type": "string",
                "value": "supported"
              }
            }
          }
        }
      }
    }
  },
  "012": {
    "P01": {
      "type": "fact_listing",
      "endpoint": "case012-fact-listing",
      "schema": {
        "type": "compound",
        "fields": {
          "client_claims_listed": {
            "type": "boolean",
            "value": true
          },
          "confirmed_facts_separated": {
            "type": "boolean",
            "value": true
          },
          "communication_records_connected": {
            "type": "boolean",
            "value": true
          },
          "phone_connections_considered": {
            "type": "boolean",
            "value": true
          },
          "meeting_connections_considered": {
            "type": "boolean",
            "value": true
          },
          "steven_identity_not_assumed": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P02": {
      "type": "identity_verification",
      "endpoint": "case012-identity-verification",
      "schema": {
        "type": "compound",
        "fields": {
          "government_record_checked": {
            "type": "boolean",
            "value": true
          },
          "financial_record_checked": {
            "type": "boolean",
            "value": true
          },
          "independent_witness_checked": {
            "type": "boolean",
            "value": true
          },
          "identity_not_independently_verified": {
            "type": "boolean",
            "value": true
          },
          "steven_independent_existence_not_established": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "field_investigation",
      "endpoint": "case012-field-investigation",
      "schema": {
        "type": "compound",
        "fields": {
          "isolated_property_identified": {
            "type": "boolean",
            "value": true
          },
          "final_job_location_traced": {
            "type": "boolean",
            "value": true
          },
          "property_records_examined": {
            "type": "boolean",
            "value": true
          },
          "booking_history_examined": {
            "type": "boolean",
            "value": true
          },
          "steven_property_connection_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "digital_forensics",
      "endpoint": "case012-digital-forensics",
      "schema": {
        "type": "compound",
        "fields": {
          "post_mortem_account_activity_identified": {
            "type": "boolean",
            "value": true
          },
          "post_mortem_phone_activity_identified": {
            "type": "boolean",
            "value": true
          },
          "activity_timing_examined": {
            "type": "boolean",
            "value": true
          },
          "activity_inconsistent_with_mike": {
            "type": "boolean",
            "value": true
          },
          "possible_third_party_access_identified": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P05": {
      "type": "motive_analysis",
      "endpoint": "case012-motive-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "beneficiary_identified": {
            "type": "boolean",
            "value": true
          },
          "fabricated_identity_identified": {
            "type": "boolean",
            "value": true
          },
          "real_participants_identified": {
            "type": "boolean",
            "value": true
          },
          "alias_participant_identified": {
            "type": "boolean",
            "value": true
          },
          "evidence_only_entities_identified": {
            "type": "boolean",
            "value": true
          },
          "benefit_from_death_identified": {
            "type": "boolean",
            "value": true
          },
          "hypotheses": {
            "type": "dict",
            "fields": {
              "H1": {
                "type": "string",
                "value": "supported"
              },
              "H2": {
                "type": "string",
                "value": "contradicted"
              },
              "H3": {
                "type": "string",
                "value": "unresolved"
              }
            }
          }
        }
      }
    }
  },
  "013": {
    "P01": {
      "type": "timeline",
      "endpoint": "timeline",
      "schema": {
        "type": "generic",
        "component": "p01Timeline"
      }
    },
    "P02": {
      "type": "asset_tracing",
      "endpoint": "asset-tracing",
      "schema": {
        "type": "compound",
        "fields": {
          "service_weapon_origin": {
            "type": "string",
            "value": "official_department_inventory"
          },
          "radio_origin": {
            "type": "string",
            "value": "pawn_records"
          },
          "same_period": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P03": {
      "type": "relationship_mapping",
      "endpoint": "case013-relationship-mapping",
      "schema": {
        "type": "compound",
        "fields": {
          "service_weapon": {
            "type": "string",
            "value": "department_inventory"
          },
          "pawned_radio": {
            "type": "string",
            "value": "private_life_contact"
          },
          "schedule_activity_overlap": {
            "type": "boolean",
            "value": true
          }
        }
      }
    },
    "P04": {
      "type": "narrative_synthesis",
      "endpoint": "case013-narrative-synthesis",
      "schema": {
        "type": "compound",
        "fields": {
          "concealed_private_life": {
            "type": "boolean",
            "value": true
          },
          "public_and_private_timelines_overlap": {
            "type": "boolean",
            "value": true
          },
          "private_life_alone_proves_murder": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case013-hypothesis",
      "schema": {
        "type": "compound",
        "fields": {
          "private_life_is_not_proof_of_murder": {
            "type": "boolean",
            "value": true
          },
          "weapon_and_radio_are_separate_evidence": {
            "type": "boolean",
            "value": true
          },
          "secrecy_and_responsibility_are_separate": {
            "type": "boolean",
            "value": true
          },
          "killer_identity_unresolved": {
            "type": "boolean",
            "value": true
          }
        }
      }
    }
  },
  "014": {
    "P01": {
      "type": "timeline",
      "endpoint": "timeline",
      "schema": {
        "type": "generic",
        "component": "p01Timeline"
      }
    },
    "P02": {
      "type": "record_check",
      "endpoint": "employment",
      "schema": {
        "type": "generic",
        "component": "p02Employment"
      }
    },
    "P03": {
      "type": "relationship_mapping",
      "endpoint": "connection",
      "schema": {
        "type": "generic",
        "component": "p03Connection"
      }
    },
    "P04": {
      "type": "statement_analysis",
      "endpoint": "contradictory",
      "schema": {
        "type": "generic",
        "component": "p04Witness"
      }
    },
    "P05": {
      "type": "investigation_gap",
      "endpoint": "missing-record",
      "schema": {
        "type": "generic",
        "component": "p05Missing"
      }
    }
  },
  "015": {
    "P01": {
      "type": "document_analysis",
      "endpoint": "document-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "supported": {
            "type": "list",
            "value": [
              "H1"
            ]
          },
          "contradicted": {
            "type": "list",
            "value": [
              "H2"
            ]
          }
        }
      }
    },
    "P02": {
      "type": "relationship_mapping",
      "endpoint": "relationship-mapping",
      "schema": {
        "type": "compound",
        "fields": {
          "knowledge_sources": {
            "type": "list",
            "value": [
              "Massie",
              "Second Voice (Unidentified)"
            ]
          },
          "single_authorship": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P03": {
      "type": "timeline_reconstruction",
      "endpoint": "timeline-reconstruction",
      "schema": {
        "type": "compound",
        "fields": {
          "order": {
            "type": "list",
            "value": [
              "phase_1",
              "phase_2",
              "phase_3",
              "phase_4",
              "phase_5"
            ]
          },
          "alcohol_conclusion": {
            "type": "string",
            "value": "alcohol_involvement_does_not_prove_why_ron_left_or_who_killed_him"
          }
        }
      }
    },
    "P04": {
      "type": "physical_evidence_analysis",
      "endpoint": "physical-evidence-analysis",
      "schema": {
        "type": "compound",
        "fields": {
          "trap_is_separate_evidence": {
            "type": "boolean",
            "value": true
          },
          "frame_up_indicated": {
            "type": "boolean",
            "value": true
          },
          "letter_writer_equals_killer": {
            "type": "boolean",
            "value": false
          }
        }
      }
    },
    "P05": {
      "type": "hypothesis_management",
      "endpoint": "case015-hypothesis",
      "schema": {
        "type": "compound",
        "fields": {
          "sequence_is_not_causation": {
            "type": "boolean",
            "value": true
          },
          "letter_writer_distinct_from_killer": {
            "type": "boolean",
            "value": true
          },
          "trap_setter_distinct_from_letter_writer": {
            "type": "boolean",
            "value": true
          },
          "killer_identity_unresolved": {
            "type": "boolean",
            "value": true
          }
        }
      }
    }
  }
};
